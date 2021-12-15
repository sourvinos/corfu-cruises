using BlueWaterCruises.Features.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class PassengersConfig : IEntityTypeConfiguration<Passenger> {

        public void Configure(EntityTypeBuilder<Passenger> entity) {
            // PK
            entity.Property(x => x.ReservationId).HasColumnType("varchar").HasMaxLength(36).IsRequired(true);
            // FKs
            entity.Property(x => x.NationalityId).IsRequired(true);
            entity.Property(x => x.OccupantId).IsRequired(true);
            entity.Property(x => x.GenderId).IsRequired(true);
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Lastname).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Firstname).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Birthdate).HasMaxLength(10);
            entity.Property(x => x.Remarks).HasMaxLength(128);
            entity.Property(x => x.Remarks).HasMaxLength(128);
            entity.Property(x => x.SpecialCare).HasMaxLength(128);
            entity.Property(x => x.IsCheckedIn).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.Nationality).WithMany(x => x.Passengers).HasForeignKey(x => x.NationalityId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Occupant).WithMany(x => x.Passengers).HasForeignKey(x => x.OccupantId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Gender).WithMany(x => x.Passengers).HasForeignKey(x => x.GenderId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.Passengers).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}