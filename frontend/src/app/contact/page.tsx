import ContactForm from "@/components/contact/ContactForm";
import GlobalSupport from "@/components/contact/GlobalSupport";
import FaqSection from "@/components/contact/FaqSection";

export default function ContactPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-2xl pt-14 text-center">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">Get in Touch</h1>
        <p className="mt-3 text-lg text-slate-500">
          Our team of specialists is ready to assist you with technical inquiries, order support, or
          project consultations. Excellence in hardware is matched only by our dedication to your
          experience.
        </p>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <ContactForm />
        <GlobalSupport />
      </section>

      <FaqSection />
    </div>
  );
}
