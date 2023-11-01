import { useState } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function Home() {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [from, setFrom] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Lütfen bir dosya yükleyin.");
      return;
    }

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    const emails = XLSX.utils.sheet_to_json(worksheet).map(entry => entry.email); 

    Swal.fire({
      title: 'Emin misiniz?',
      text: "Mail gönderimi başlatılacak!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, gönder!'
    }).then((result) => {
      if (result.isConfirmed) {
        sendEmails(emails);
      }
    });
  }

  const sendEmails = (emails) => {
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emails, subject, from })
    }).then((res) => {
      if (res.ok) {
        Swal.fire(
          'Başarılı!',
          'E-postalar gönderildi.',
          'success'
        )
        setFile(null);
        setSubject('');
        setFrom('');
      } else {
        Swal.fire(
          'Hata!',
          'E-postalar gönderilemedi.',
          'error'
        )
      }
    });
  }

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">E-posta Gönderimi</h2>
        <label className="block mb-2 text-gray-700" htmlFor="from-input">
          Gönderen
        </label>
        <input
          id="from-input"
          type="text"
          placeholder="info@example.com"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <label className="block mb-2 text-gray-700" htmlFor="subject-input">
          Konu
        </label>
        <input
          id="subject-input"
          type="text"
          placeholder="E-posta Konusu"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <label className="block mb-2 text-gray-700" htmlFor="file-input">
          Dosya Yükleme
        </label>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          accept=".xlsx, .xls"
          className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          E-postaları Gönder
        </button>
      </form>
    </div>

    </main>
  )
}
