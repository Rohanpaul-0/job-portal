export default function ResumePage() {
  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold">Resume</h1>
      <a href="/resume.pdf" download className="inline-block mt-4 border px-4 py-2 rounded-2xl shadow">
        Download PDF
      </a>
      <iframe src="/resume.pdf#view=FitH" className="w-full h-[80vh] mt-6 border rounded-xl" />
    </main>
  );
}
