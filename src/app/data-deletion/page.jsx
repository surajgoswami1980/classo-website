import LegalDocument from '../../components/legal/LegalDocument';
import DeletionRequestForm from '../../components/legal/DeletionRequestForm';
import { documents } from '../../lib/legal';

const doc = documents['data-deletion'];
// This URL goes in the Google Play "Data safety → Delete account URL" field.
export const metadata = { title: doc.title, description: doc.summary, alternates: { canonical: '/data-deletion' } };

export default function Page() {
  return (
    <LegalDocument slug="data-deletion" doc={doc}>
      <section id="request" className="mt-8 scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#14213D]">Request account deletion</h2>
        <p className="mt-1 text-sm text-gray-500">Can&apos;t sign in to the app? Send your request here and we&apos;ll verify it with your school.</p>
        <div className="mt-5"><DeletionRequestForm /></div>
      </section>
    </LegalDocument>
  );
}
