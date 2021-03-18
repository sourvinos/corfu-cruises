using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Razor;

namespace CorfuCruises {

      public class FeatureViewLocationExpander : IViewLocationExpander {

            public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations) =>
                  new List<string> {
                        "/Infrastructure/Email/Views/{0}.cshtml"
                  };

            public void PopulateValues(ViewLocationExpanderContext context) { }

      }

}