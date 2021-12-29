using System.Linq;
using BlueWaterCruises.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BlueWaterCruises.Infrastructure.Extensions {

    public class ModelValidationAttribute : IActionFilter {

        public void OnActionExecuting(ActionExecutingContext context) {
            if (context.ActionArguments.SingleOrDefault(p => p.Value is IEntity).Value == null) {
                context.Result = new BadRequestObjectResult("Object can not be null");
            }
            if (!context.ModelState.IsValid) {
                context.Result = new BadRequestObjectResult(context.ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage));
            }
        }

        public void OnActionExecuted(ActionExecutedContext context) { }

    }

}