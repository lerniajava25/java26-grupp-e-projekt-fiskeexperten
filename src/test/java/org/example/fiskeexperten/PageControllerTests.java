package org.example.fiskeexperten;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@WebMvcTest(PageController.class)
@Import(SecurityConfig.class)
class PageControllerTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void anonymousLoginRendersSharedHeadAndDemonstrationLink() throws Exception {
        mvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(content().string(containsString("Logga in – FiskeExperten")))
                .andExpect(content().string(containsString("href=\"/karta\"")))
                .andExpect(content().string(containsString("ingen autentisering sker")));
    }

    @Test
    void anonymousMapRendersCatchesAndPanel() throws Exception {
        mvc.perform(get("/karta"))
                .andExpect(status().isOk())
                .andExpect(view().name("karta"))
                .andExpect(content().string(containsString("Karta &amp; fångster – FiskeExperten")))
                .andExpect(content().string(containsString("Mälaren, Västerås")))
                .andExpect(content().string(containsString("Hjälmaren")))
                .andExpect(content().string(containsString("Registrera fångst")))
                .andExpect(content().string(containsString("Spara fångst (inte tillgängligt)")));
    }

    @Test
    void anonymousStaticResourcesAreAvailable() throws Exception {
        mvc.perform(get("/css/output.css")).andExpect(status().isOk());
        mvc.perform(get("/js/karta.js")).andExpect(status().isOk());
    }

    @Test
    void otherResourcesRequireAuthentication() throws Exception {
        mvc.perform(get("/private").with(httpBasic("invalid", "invalid")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void csrfRemainsEnabled() throws Exception {
        mvc.perform(post("/karta")).andExpect(status().isForbidden());
        mvc.perform(post("/karta").with(csrf())).andExpect(status().isMethodNotAllowed());
    }
}