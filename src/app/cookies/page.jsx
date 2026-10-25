import LegalDocument from '../../components/legal/LegalDocument';
import { documents } from '../../lib/legal';

const doc = documents.cookies;
export const metadata = { title: doc.title, description: doc.summary, alternates: { canonical: '/cookies' } };

export default function Page() {
  return <LegalDocument slug="cookies" doc={doc} />;
}
