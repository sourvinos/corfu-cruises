using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises {

    public class EmailNotificationsController : Controller {

        private IWebHostEnvironment _hostingEnv;

        public EmailNotificationsController(IWebHostEnvironment env) {
            _hostingEnv = env;
        }

        public IActionResult ActivationError(string userId, string token) {
            return View(_hostingEnv);
        }

        public IActionResult ActivationSuccess() {
            return View();
        }

    }

}