// 📁 src/main/java/com/chronote/chronote/ChronoteApplication.java

package com.chronote.chronote;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ✅ 이 줄 추가
public class ChronoteApplication {
	public static void main(String[] args) {
		SpringApplication.run(ChronoteApplication.class, args);
	}
}