using BlueWaterCruises.Features.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class ReservationsConfig : IEntityTypeConfiguration<Reservation> {

        public void Configure(EntityTypeBuilder<Reservation> entity) {
            // PK
            entity.Property(x => x.ReservationId).HasColumnType("char").HasMaxLength(36).IsRequired(true);
            // Fields
            entity.Property(x => x.Date).HasColumnType("date").HasMaxLength(10).IsRequired(true);
            entity.Property(x => x.DestinationId).IsRequired(true);
            entity.Property(x => x.CustomerId).IsRequired(true);
            entity.Property(x => x.PickupPointId).IsRequired(true);
            entity.Property(x => x.ShipId).IsRequired(true);
            entity.Property(x => x.DriverId).IsRequired(true);
            entity.Property(x => x.PortId).IsRequired(true);
            entity.Property(x => x.TicketNo).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.TotalPersons).HasComputedColumnSql("((`Adults` + `Kids`) + `Free`)", stored: false);
            entity.Property(x => x.Email).HasMaxLength(128);
            entity.Property(x => x.Phones).HasMaxLength(128);
            entity.Property(x => x.Adults).IsRequired(true);
            entity.Property(x => x.Kids).IsRequired(true);
            entity.Property(x => x.Free).IsRequired(true);
            entity.Property(x => x.Remarks).HasMaxLength(128);
            entity.Property(x => x.UserId).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.Destination).WithMany(x => x.Reservations).HasForeignKey(x => x.DestinationId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Customer).WithMany(x => x.Reservations).HasForeignKey(x => x.CustomerId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.PickupPoint).WithMany(x => x.Reservations).HasForeignKey(x => x.PickupPointId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Ship).WithMany(x => x.Reservations).HasForeignKey(x => x.ShipId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Driver).WithMany(x => x.Reservations).HasForeignKey(x => x.DriverId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Port).WithMany(x => x.Reservations).HasForeignKey(x => x.PortId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.Reservations).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}