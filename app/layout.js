import './globals.css';

export const metadata = {
  title: "Umar's Wrld",
  description: '3D interactive portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
