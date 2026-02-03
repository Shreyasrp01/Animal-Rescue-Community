package com.arc.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {
	private LocalDateTime timeStamp;
	private String message;
	private String status;
	public ApiResponse(String message, String status) {
		super();
		this.timeStamp = LocalDateTime.now();
		this.message = message;
		this.status = status;
	}
	
}
