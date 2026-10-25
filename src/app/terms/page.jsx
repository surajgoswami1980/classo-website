import LegalDocument from '../../components/legal/LegalDocument';
import { documents } from '../../lib/legal';

const doc = documents.terms;
export const metadata = { title: doc.title, description: doc.summary, alternates: { canonical: '/terms' } };

export default function Page() {
  return <LegalDocument slug="terms" doc={doc} />;
}
