import { useState } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function Home() {
  const [file, setFile] = useState(null);

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
      body: JSON.stringify({ emails })
    }).then((res) => {
      if (res.ok) {
        Swal.fire(
          'Başarılı!',
          'E-postalar gönderildi.',
          'success'
        )
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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        <button className="bg-slate-800 text-white rounded p-3 mt-5" type="submit">
          Send
        </button>
      </form>
    </main>
  )
}
