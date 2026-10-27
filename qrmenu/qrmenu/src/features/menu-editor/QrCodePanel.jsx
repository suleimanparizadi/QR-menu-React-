export default function QrCodePanel({ menu }) {
  if (!menu.qr_code) {
    return <div className="card">QR code is being generated...</div>;
  }

  const publicUrl = `${import.meta.env.VITE_API_URL}/menu/${menu.id}/`;

  return (
    <div className="card">
      <h3>QR Code</h3>
      <img src={menu.qr_code} alt="QR Code" className="qr-img" />
      <p>
        Public URL: <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>
      </p>
    </div>
  );
}