import LegalDocument from '../../components/legal/LegalDocument';
import { documents } from '../../lib/legal';

const doc = documents['refund-policy'];
export const metadata = { title: doc.title, description: doc.summary, alternates: { canonical: '/refund-policy' } };

export default function Page() {
  return <LegalDocument slug="refund-policy" doc={doc} />;
}
