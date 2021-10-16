using BlueWaterCruises.Features.Genders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class GendersConfig : IEntityTypeConfiguration<Gender> {

        public void Configure(EntityTypeBuilder<Gender> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Genders).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}