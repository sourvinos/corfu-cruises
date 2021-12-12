using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace BlueWaterCruises.Infrastructure.Email {

    public class EmailNotificationsController : Controller {

        private readonly IWebHostEnvironment _hostingEnv;

        public EmailNotificationsController(IWebHostEnvironment env) {
            _hostingEnv = env;
        }

        public IActionResult ActivationError() {
            return View(_hostingEnv);
        }

        public IActionResult ActivationSuccess() {
            return View();
        }

    }

}