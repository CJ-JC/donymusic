import React from "react";
import { Card, Typography } from "@material-tailwind/react";

// Composant Invoice (Factures)
const Invoice = ({ user }) => {
  return (
    <Card className="p-6">
      <Typography variant="h4" className="mb-4">
        Mes Factures
      </Typography>
      <div className="space-y-4">
        {user?.invoices?.map((invoice, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6">Facture #{invoice.id}</Typography>
                <Typography className="text-gray-600">
                  {invoice.date}
                </Typography>
              </div>
              <Typography>{invoice.amount}€</Typography>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default Invoice;
