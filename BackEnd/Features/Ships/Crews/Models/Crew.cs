using System;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Features.Nationalities;
using BlueWaterCruises.Features.Ships.Base;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Ships.Crews {

    public class Crew {

        // PK
        public int Id { get; set; }
        // Fields
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public DateTime Birthdate { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public int GenderId { get; set; }
        public int NationalityId { get; set; }
        public int ShipId { get; set; }
        public string UserId { get; set; }
        // Navigation
        public Gender Gender { get; set; }
        public Nationality Nationality { get; set; }
        public Ship Ship { get; set; }
        public AppUser User { get; set; }

    }

}