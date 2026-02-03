package com.arc;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import com.arc.dto.AnimalDTO;
import com.arc.dto.ExpenseDTO;
import com.arc.entities.Animal;
import com.arc.entities.Expense;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;


@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	// configure ModelMapper class as a spring bean
	@Bean
	public ModelMapper modelMapper() {
	    ModelMapper mapper = new ModelMapper();

	    mapper.getConfiguration()
	          .setMatchingStrategy(MatchingStrategies.STRICT);

	    /* ================= ANIMAL ================= */
	    mapper.typeMap(Animal.class, AnimalDTO.class)
	          .addMapping(Animal::getPhoto, AnimalDTO::setPhoto);

	    mapper.typeMap(AnimalDTO.class, Animal.class)
	          .addMapping(AnimalDTO::getPhoto, Animal::setPhoto);

	    /* ================= EXPENSE ================= */
	    mapper.typeMap(Expense.class, ExpenseDTO.class)
	          .addMappings(m -> {
	              m.map(Expense::getExpenseDate, ExpenseDTO::setExpenseDate);
	              m.map(Expense::getPaidTo, ExpenseDTO::setPaidTo);
	              m.map(Expense::getExpenseProof, ExpenseDTO::setExpenseProof);
	          });

	    return mapper;
	}

	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
    public ObjectMapper objectMapper() {
        return JsonMapper.builder()
                .findAndAddModules()
                .build();
    }

	@Bean
	public RestTemplate restTemplate() {
	    return new RestTemplate();
	}

}
