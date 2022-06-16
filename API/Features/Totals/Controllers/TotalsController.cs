using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Totals {

    [Route("api/[controller]")]
    public class TotalsController : ControllerBase {

        #region variables

        private readonly ITotalsRepository repo;

        #endregion

        public TotalsController(ITotalsRepository repo) {
            this.repo = repo;
        }

        [HttpGet("fromDate/{fromDate}/toDate/{toDate}")]
        [Authorize(Roles = "user, admin")]
        public Task<IEnumerable<TotalsReportVM>> Get(string fromDate, string toDate) {
            return repo.Get(fromDate, toDate);
        }

    }

}