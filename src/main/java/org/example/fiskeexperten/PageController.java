package org.example.fiskeexperten;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class PageController {

    private final List<DemoCatch> demoCatches = List.of(
            new DemoCatch(1, "Gädda", "12 nov", "Mälaren, Västerås", "4,2 kg", "82 cm", 30, 40, "one"),
            new DemoCatch(2, "Abborre", "8 nov", "Vättern, Hjo", "0,9 kg", "38 cm", 55, 62, "two"),
            new DemoCatch(3, "Gös", "2 nov", "Hjälmaren", "2,7 kg", "64 cm", 70, 30, "three"),
            new DemoCatch(4, "Öring", "28 okt", "Klarälven", "1,6 kg", "51 cm", 42, 20, "four")
    );

    @GetMapping("/")
    public String login() {
        return "login";
    }

    @GetMapping("/karta")
    public String map(Model model) {
        model.addAttribute("catches", demoCatches);
        return "karta";
    }
}
