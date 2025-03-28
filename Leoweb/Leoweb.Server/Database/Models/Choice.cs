﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Leoweb.Server.Database.Models
{
	public class Choice
	{
		[Key]
		public int Id { get; set; }
		[ForeignKey(nameof(Poll))]
		public int PollId { get; set; }
		public string Description { get; set; } = string.Empty;

		public Poll Poll { get; set; }
	}
}
