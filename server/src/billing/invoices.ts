import { getStripe } from "./stripe.js";

export async function getInvoices(
  customerId:string
){
  const stripe=getStripe();

  const invoices=
    await stripe.invoices.list({
      customer:customerId,
      limit:20,
    });

  return invoices.data;
}

export async function getInvoice(
  invoiceId:string
){
  const stripe=getStripe();

  return stripe.invoices.retrieve(
    invoiceId
  );
}

export function invoiceStatus(
  invoice:any
){
  return{
    id:invoice.id,
    amount:invoice.amount_paid,
    status:invoice.status,
    date:new Date(
      invoice.created*1000
    ),
  };
}
