// frontend/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div>© Paggo OCR Case — {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
