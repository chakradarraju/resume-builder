import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/app/ConfigContext";
import { FaDownload } from "react-icons/fa";
import { useEffect } from "react";
import type { default as PrintJS } from 'print-js';
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { redirect, useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import { useProfile } from "@/app/ProfileContext";
import { HiOutlineDocumentText } from "react-icons/hi2";

var printJS: (typeof PrintJS | null) = null;

const DownloadDialog: React.FC<{}> = () => {
  const { creditsRemaining, setCreditsRemaining, printMode, setPrintMode } = useConfig();
  const { profile } = useProfile();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  const paymentStatus = searchParams.get('status');

  async function verifyPayment() {
    const response = await fetch('/api/user', { method: 'POST', body: JSON.stringify({action: 'verifyPayment', id: paymentId })});
    const body = await response.json();
    if (!response.ok || !body.success) {
      console.log('Failed to verify payment');
    }
    loadCreditsRemaining();
    redirect('/builder');
  }

  useEffect(() => {
    if (paymentId && paymentStatus === 'succeeded')
      verifyPayment();
  }, []);

  async function buyCredits() {
    if (status !== 'loading' && !session) {
      console.log('Not logged in, redirecting to login');
      redirect('/login');
    }
    const link = `${process.env.NEXT_PUBLIC_DODO_PAYMENT_LINK}${process.env.NEXT_PUBLIC_BASEURL}/builder`;
    redirect(link);
  }

  async function exportToPDF() {
    const response = await fetch('/api/user', { method: "POST", body: JSON.stringify({ action: 'lockCredit', profile: profile })});
    const responseBody = await response.json();
    if (!response.ok || !responseBody.success) {
      console.log('Unable to block credit', responseBody);
      setCreditsRemaining(0);
    }
    if (!printJS) {
      const module = await import('print-js');
      printJS = module.default;
    }
    setPrintMode(true);
  }

  async function loadCreditsRemaining() {
    const response = await fetch('/api/user');
    const responseBody = await response.json().catch(console.error);
    setCreditsRemaining(responseBody.creditsRemaining ?? 0);
  }

  useEffect(() => {
    loadCreditsRemaining();
  }, []);

  useEffect(() => {
    if (printMode && printJS) {
      printJS({
          printable: 'page-1',
          maxWidth: 1000,
          type: 'html',
          targetStyles: ['*'],
          showModal: false,
          honorMarginPadding: false,
          style: '@import url(https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap);',
          css: '/_next/static/css/app/layout.css?v=1733040129890',
          font: 'Nunito',
          font_size: '',
      });
      if (creditsRemaining > 0) loadCreditsRemaining();
      setPrintMode(false);
    }
  }, [printMode]);

  return (<DialogRoot>
    <DialogBackdrop />
    <DialogTrigger asChild>
      <Button colorPalette="orange" className="mx-2" color="white"><HiOutlineDocumentText /> Download</Button>
    </DialogTrigger>
    <DialogContent color="black">
      <DialogCloseTrigger />
      <DialogHeader>
        <DialogTitle>Download</DialogTitle>
      </DialogHeader>
      <DialogBody>
        {creditsRemaining > 0 && <p>You can download {creditsRemaining} resumes.</p>}
        {creditsRemaining === 0 && <p>You can download resume for free (which will include ResumeGenie watermark), or purchase credits and download resume without watermark.</p>}
      </DialogBody>
      <DialogFooter>
        {creditsRemaining === 0 && <Button variant="outline" className="mx-2" onClick={exportToPDF}><FaDownload /> Free Download</Button>}
        {creditsRemaining === 0 && <Button colorPalette="orange" className="mx-2" onClick={buyCredits}><FaCircleDollarToSlot /> Purchase credits</Button>}
        {creditsRemaining > 0 && <Button colorPalette="orange" className="mx-2" color="white" onClick={exportToPDF}><FaDownload /> Download</Button>}
      </DialogFooter>
    </DialogContent>
  </DialogRoot>)
}

export default DownloadDialog;