using BlueWaterCruises.Features.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class PassengersConfig : IEntityTypeConfiguration<Passenger> {

        public void Configure(EntityTypeBuilder<Passenger> entity) {
            entity.Property(p => p.ReservationId).HasMaxLength(36).IsRequired(true);
            entity.Property(p => p.Lastname).HasMaxLength(128).IsRequired(true);
            entity.Property(p => p.Firstname).HasMaxLength(128).IsRequired(true);
            entity.Property(p => p.Birthdate).HasMaxLength(10);
            entity.Property(p => p.Remarks).HasMaxLength(128);
            entity.Property(p => p.Remarks).HasMaxLength(128);
            entity.Property(p => p.SpecialCare).HasMaxLength(128);
            entity.Property(p => p.IsCheckedIn).IsRequired(true);
            entity.Property(p => p.NationalityId).IsRequired(true);
            entity.Property(p => p.OccupantId).IsRequired(true);
            entity.Property(p => p.GenderId).IsRequired(true);
            entity.HasOne(x => x.Nationality).WithMany(x => x.Passengers).HasForeignKey(x => x.NationalityId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Occupant).WithMany(x => x.Passengers).HasForeignKey(x => x.OccupantId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Gender).WithMany(x => x.Passengers).HasForeignKey(x => x.GenderId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}