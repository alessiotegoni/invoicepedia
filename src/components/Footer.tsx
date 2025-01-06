import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-6 mb-8">
      <Container className="flex justify-between items-center">
        <p className="text-sm">
          Invoicepedia &copy; {new Date().getFullYear()}
        </p>
        <p className="text-sm">Nextjs app</p>
      </Container>
    </footer>
  );
}
