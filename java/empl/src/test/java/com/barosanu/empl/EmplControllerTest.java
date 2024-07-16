package com.barosanu.empl;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.barosanu.empl.model.Employee;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(EmplController.class)
public class EmplControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
    private ObjectMapper objectMapper;

	@MockBean
	private EmplService emplService;

    @Test
    public void getEmployeesTest() throws Exception {
        Employee e1 = new Employee();
        Employee e2 = new Employee();
        List<Employee> employees = Arrays.asList(e1, e2);
        when(emplService.getAllEmployees()).thenReturn(employees);

        mockMvc.perform(get("/employees/all"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(employees)));

        verify(emplService, times(1)).getAllEmployees();
    }

	@Test
	public void testGetEmployeesByPositionMvc() throws Exception {
		mockMvc.perform(get("/employees/get").param("position", "Developer"))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON));
	}

	@Test
	public void testAddEmployeeMvc() throws Exception {
        Employee e = new Employee(
            "John",
            "Doe",
            new Date(),
            "Manager");
        when(emplService.addEmployee(e)).thenReturn(e);
		mockMvc.perform(post("/employees/add")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(e)))
				.andExpect(content().json(objectMapper.writeValueAsString(e))) // Example JSON, adjust fields accordingly
				.andExpect(status().isOk());
	}

	@Test
	public void testUpdateEmployeesPositionMvc() throws Exception {
		mockMvc.perform(put("/employees/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"position\":\"Senior Developer\"}")) // Example JSON, adjust fields accordingly
				.andExpect(status().isOk());
	}

	@Test
	public void testDeleteEmployeeByIdMvc() throws Exception {
		mockMvc.perform(delete("/employees/1"))
				.andExpect(status().isOk());
	}
}