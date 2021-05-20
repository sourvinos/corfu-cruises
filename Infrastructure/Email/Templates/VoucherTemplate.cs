using System.Text;

namespace CorfuCruises {

    public static class VoucherTemplate {

        public static string GetHtmlString(Voucher voucher) {

            var sb = new StringBuilder();

            sb.Append(@"
                <html>
                    <body>
                        <div id='wrapper'>
                            <div id='logo'>
                                <img src='[logo]'/>
                            </div>
                            <div class='group'>
                                <div class='text lower'>Dear guest,</div>
                                <div class='text lower'>Your reservation for</div>
                                <div class='text upper'>[destination]</div>
                                <div class='text lower'>is confirmed</div>
                            </div>
                            <div class='group table'>
                                <table>
                                    <thead>
                                        <td colspan='2' class='text center'>Pickup details</td>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class='text'>Date</td>
                                            <td class='text'>[date]</td>
                                        </tr>
                                        <tr>
                                            <td class='text'>Pickup point</td>
                                            <td class='text'>[pickupPointDescription]</td>
                                        </tr>
                                        <tr>
                                            <td class='text'>Exact point</td>
                                            <td class='text'>[exactPoint]</td>
                                        </tr>
                                        <tr>
                                            <td class='text'>Time</td>
                                            <td class='text'>[time]</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class='group table'>
                                <table>
                                <thead>
                                    <td colspan='2' class='text center'>Passenger details</td>
                                </thead>
                                <tbody>");
                                    foreach (var passenger in voucher.Passengers) {
                                        sb.AppendFormat(@"<tr><td>{0}</td><td>{1}</td></tr>", passenger.Lastname, passenger.Firstname);
                                    };
                                    sb.Append(@"
                                </tbody>
                                </table>
                            </div>
                            <div id='barcode'>
                                <img src='[barcode]'/>
                            </div>
                            <div id='social-media'>
                                <img src='[facebook]'/>
                                <img src='[youtube]'/>
                                <img src='[instagram]'/>
                            </div>
                            <div class='group' id='questions'>
                                <div class='text small'>Problems or questions? Call us at +30 26620 61400</div>
                                <div class='text small'>or email at info@corfucruises.com</div>
                                <div class='text small'>© Corfu Cruises 2021, Kavos - Corfu - Greece</div>
                                <div class='text small'>Do not reply to this email.</div>
                            </div>
                        </div>
                    </body>
                </html>
            ");
 
            return sb.ToString();
 
        }

    }

}