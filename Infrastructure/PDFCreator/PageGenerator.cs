using System.Text;

namespace CorfuCruises {

    public static class TemplateGenerator {

        public static string GetHtmlString(string imageUrl) {

            var sb = new StringBuilder();

            sb.Append(@"<html><head></head>");
            sb.Append(@"<body>");
            sb.Append(@"<img src=" + imageUrl + " />");
            sb.Append(@"</body>");
            sb.Append(@"</html>");

            return sb.ToString();
        }

    }

}
