using System;
using API.Features.Genders;
using API.Features.Nationalities;
using API.Features.Ships.Base;
using API.Infrastructure.Identity;

namespace API.Features.Ships.Crews {

    public class Crew {

        // PK
        public int Id { get; set; }
        // FKs
        public int ShipId { get; set; }
        public int NationalityId { get; set; }
        public int GenderId { get; set; }
        // Fields
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public DateTime Birthdate { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public Gender Gender { get; set; }
        public Nationality Nationality { get; set; }
        public Ship Ship { get; set; }
        public UserExtended User { get; set; }

    }

}