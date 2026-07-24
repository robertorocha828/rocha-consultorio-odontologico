interface EmailTemplateParams {
  titulo: string;
  contenidoHtml: string;
  textoBoton?: string;
  urlBoton?: string;
}

export function emailTemplate({ titulo, contenidoHtml, textoBoton, urlBoton }: EmailTemplateParams): string {
  const boton = textoBoton && urlBoton
    ? `
      <tr>
        <td style="padding: 8px 40px 32px 40px;" align="center">
          <a href="${urlBoton}"
             style="background-color:#1b8a9c;color:#ffffff;text-decoration:none;
                    padding:12px 28px;border-radius:999px;font-weight:600;
                    font-family:Arial,Helvetica,sans-serif;font-size:14px;display:inline-block;">
            ${textoBoton}
          </a>
        </td>
      </tr>`
    : '';

  return `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#eaf5f7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eaf5f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(10,37,64,0.08);">

          <tr>
            <td style="background:linear-gradient(135deg,#0a2540 0%,#1b8a9c 100%);padding:28px 40px;" align="left">
              <span style="font-size:22px;font-weight:700;color:#ffffff;">🦷&nbsp; DentalCare</span>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px 8px 40px;">
              <h1 style="margin:0 0 16px 0;font-size:20px;color:#0a2540;">${titulo}</h1>
              <div style="font-size:15px;line-height:1.6;color:#3a4a58;">
                ${contenidoHtml}
              </div>
            </td>
          </tr>

          ${boton}

          <tr>
            <td style="background-color:#f5f9fa;padding:20px 40px;border-top:1px solid #e3edf0;">
              <p style="margin:0;font-size:12px;color:#7a8a96;">
                DentalCare · Consultorio Odontológico<br />
                Quito, Ecuador · (02) 555-0000
              </p>
              <p style="margin:8px 0 0 0;font-size:11px;color:#a3b1bb;">
                Este es un correo automático, por favor no respondas a esta dirección.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}