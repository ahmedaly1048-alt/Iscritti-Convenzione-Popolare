import Link from "next/link";

export const metadata = { title: "Informativa privacy | Convenzione Popolare" };

// TEMPLATE: replace the [BRACKETED] parts and have it checked by a professional.
export default function Privacy() {
  return (
    <main className="formpage">
      <article className="panel prose">
        <h1>Informativa sulla privacy</h1>
        <p>Ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679 (GDPR).</p>
        <p>Ultimo aggiornamento: [DATA].</p>

        <h2>Titolare del trattamento</h2>
        <p>[NOME / ASSOCIAZIONE], [INDIRIZZO], email: [EMAIL DI CONTATTO].</p>

        <h2>Dati raccolti</h2>
        <p>
          Nome e cognome, numero WhatsApp o indirizzo email, città o CAP, l&apos;eventuale codice invito di
          un amico, il codice invito personale che ti viene assegnato, la data e l&apos;ora della tua
          iscrizione e del consenso. Non raccogliamo il tuo indirizzo di casa.
        </p>

        <h2>Finalità e base giuridica</h2>
        <p>
          <strong>1. Gestione dell&apos;iscrizione e comunicazioni.</strong> Registrare la tua adesione alla
          Convenzione Popolare e inviarti, via email o WhatsApp, informazioni sulle convenzioni e sulle
          iniziative del gruppo d&apos;acquisto. Base giuridica: il tuo consenso (art. 6.1.a GDPR),
          registrato con data e ora.
        </p>
        <p>
          <strong>2. Distribuzione geografica degli iscritti.</strong> La città o il CAP che indichi servono
          agli organizzatori per vedere su una mappa in quali zone si trovano gli iscritti e per valutare
          le convenzioni più utili. Per posizionare l&apos;iscritto sulla mappa viene inviato a Google solo il
          nome del luogo, non i tuoi dati personali. Base giuridica: il tuo consenso.
        </p>
        <p>
          <strong>3. Invito tra amici.</strong> Se ti iscrivi con il codice invito di un amico, il tuo nome
          e l&apos;iniziale del cognome saranno visibili a quella persona, per mostrarle quanti amici si sono
          iscritti grazie a lei. Nessun altro dato viene mostrato. Base giuridica: il tuo consenso.
        </p>
        <p>I tuoi dati non vengono venduti a terzi.</p>

        <h2>Conservazione e destinatari</h2>
        <p>
          I dati sono conservati fino alla revoca del consenso, in un archivio ospitato su servizi Google
          (Google Sheets e Google Maps per la sola localizzazione del luogo) e su infrastruttura Vercel,
          che ospita il sito. Questi fornitori agiscono come responsabili del trattamento e possono
          trattare i dati anche fuori dall&apos;Unione Europea, con le garanzie previste dal GDPR.
          L&apos;accesso all&apos;elenco è riservato agli organizzatori autorizzati.
          [ELENCA EVENTUALI ALTRI DESTINATARI, ad esempio il servizio usato per l&apos;invio delle email].
        </p>

        <h2>Dati sul tuo dispositivo</h2>
        <p>
          Dopo l&apos;iscrizione, il tuo codice invito personale viene salvato nel browser del tuo
          dispositivo, per mostrarti i tuoi amici iscritti e il pulsante di condivisione. Puoi cancellarlo
          in qualsiasi momento con il link &quot;Non sei tu?&quot; o svuotando i dati del browser. Non
          usiamo cookie di profilazione né di pubblicità.
        </p>

        <h2>Obbligatorietà del conferimento</h2>
        <p>
          Il conferimento dei dati è facoltativo, ma senza nome, contatto e città non è possibile
          completare l&apos;iscrizione.
        </p>

        <h2>I tuoi diritti</h2>
        <p>
          Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e revocare il consenso
          in qualsiasi momento scrivendo a [EMAIL]. La revoca non pregiudica la liceità del trattamento
          avvenuto prima. Hai diritto di reclamo al Garante per la protezione dei dati personali
          (garanteprivacy.it).
        </p>

        <p><Link href="/">← Torna alla pagina iniziale</Link></p>
      </article>
    </main>
  );
}