const generateInvoiceEmailTemplate = ({ fullname, product, payment, item, productTitle }) => {
    return `
<section class="mx-auto max-w-2xl bg-white px-6 py-8 dark:bg-gray-900">
  <main class="mt-8">
    <h4 class="text-gray-700 dark:text-gray-200">Bonjour ${fullname},</h4>

    <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Nous vous remercions pour votre achat sur Donymusic !
        </p>
     </div>
     <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Nous sommes ravis de vous compter parmi nos clients et nous vous félicitons pour votre engagement à développer vos compétences musicales.</p>
     </div>
    <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
       <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Voici les détails de votre achat :</p>
     </div>
     <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <ul>
            <li><strong>${product} :</strong> ${productTitle}</li>
            <li><strong>montant payé :</strong> ${payment.amount}€</li>
        </ul>
     </div>

    <p class="mt-8 text-gray-600 dark:text-gray-300">
      Vous pouvez accéder à votre produit via votre espace utilisateur ou en cliquant sur le lien suivant :
    </p>

    <a
      href="${item.slug}"
      class="mt-4 inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
    >
      Accéder à ${product}
    </a>
  </main>

  <footer class="mt-8">
    <p><strong>Support :</strong></p>
    <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter <a href="mailto:contact@donymusic.com">contact@donymusic.com</a>.</p>

    <p class="mt-3 text-gray-500 dark:text-gray-400">
        Nous vous souhaitons une expérience enrichissante et pleine de succès !
    </p>
    <p>Musicalement,</p>

    <div style="font-size:13px;color:#9ca3af;">
         <img src="https://donymusic.fr/logo-day.svg" style="width: 200px;" alt="logo-donymusic" /><br>
         123 Rue de la Musique, 75001 Paris, France<br>
         Téléphone : +33 1 23 45 67 89<br>
         Email : contact@donymusic.com
     </div>
  </footer>
</section>
`;
};

export default generateInvoiceEmailTemplate;
