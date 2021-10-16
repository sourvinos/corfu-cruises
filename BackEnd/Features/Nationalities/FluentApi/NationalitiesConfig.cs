using BlueWaterCruises.Features.Nationalities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class NationalitiesConfig : IEntityTypeConfiguration<Nationality> {

        public void Configure(EntityTypeBuilder<Nationality> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Code).HasMaxLength(10).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Nationalities).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}