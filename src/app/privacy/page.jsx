import LegalDocument from '../../components/legal/LegalDocument';
import { documents } from '../../lib/legal';

const doc = documents.privacy;
export const metadata = { title: doc.title, description: doc.summary, alternates: { canonical: '/privacy' } };

export default function Page() {
  return <LegalDocument slug="privacy" doc={doc} />;
}
