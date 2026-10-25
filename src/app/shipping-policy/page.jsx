import LegalDocument from '../../components/legal/LegalDocument';
import { documents } from '../../lib/legal';

const doc = documents['shipping-policy'];
export const metadata = { title: doc.title, description: doc.summary, alternates: { canonical: '/shipping-policy' } };

export default function Page() {
  return <LegalDocument slug="shipping-policy" doc={doc} />;
}
