using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TaskBoard.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    Priority = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    DueDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tasks_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TaskId = table.Column<int>(type: "INTEGER", nullable: false),
                    Author = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Body = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "CreatedAt", "Description", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Redesign the company website", "Website Redesign" },
                    { 2, new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Build iOS and Android app", "Mobile App" }
                });

            migrationBuilder.InsertData(
                table: "Tasks",
                columns: new[] { "Id", "CreatedAt", "Description", "DueDate", "Priority", "ProjectId", "Status", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2024, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), "High", 1, "Done", "Design mockups", new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 18, 17, 55, 34, 504, DateTimeKind.Utc).AddTicks(3730), "High", 1, "InProgress", "Implement homepage", new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2024, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 13, 17, 55, 34, 504, DateTimeKind.Utc).AddTicks(3750), "Medium", 1, "Todo", "SEO optimization", new DateTime(2024, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2024, 1, 6, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Critical", 2, "Done", "Setup React Native", new DateTime(2024, 1, 6, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2024, 1, 7, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 20, 17, 55, 34, 504, DateTimeKind.Utc).AddTicks(3760), "High", 2, "InProgress", "Auth screens", new DateTime(2024, 1, 7, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, new DateTime(2024, 1, 8, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Low", 2, "Todo", "Push notifications", new DateTime(2024, 1, 8, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "Author", "Body", "CreatedAt", "TaskId" },
                values: new object[,]
                {
                    { 1, "Alice", "Mockups approved by stakeholders.", new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), 1 },
                    { 2, "Bob", "Working on the hero section.", new DateTime(2024, 1, 11, 0, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 3, "Carol", "Login screen done, working on signup.", new DateTime(2024, 1, 12, 0, 0, 0, 0, DateTimeKind.Utc), 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_TaskId",
                table: "Comments",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Name",
                table: "Projects",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_Priority",
                table: "Tasks",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectId",
                table: "Tasks",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_Status",
                table: "Tasks",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
