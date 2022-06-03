window.addEventListener("DOMContentLoaded", function(event){
	number_sections();
	setup_section_selectors();
	start_first_slide();
	//setup_section_colors();
});

window.current_slide = 0;

function number_sections(){
	let sections = document.querySelectorAll(".section");
	sections.forEach(function(sec, i){
		sec.id = "section-" + i;
		sec.dataset.sectionNumber = i;
	});
}

function setup_section_selectors(){
	let sections = document.querySelectorAll(".section");
	let section_selector_container = document.querySelector("#section-selector-container");

	sections.forEach(function(current_section, index, all_sections){
		let section_selector = document.createElement("div");
		section_selector.classList.add("section-selector")
		section_selector.id = "selector-" + index;
		section_selector.dataset.selectorNumber = index;
		
		section_selector.addEventListener("click", slide_transition);

		section_selector_container.appendChild(section_selector);

	});
}

function start_first_slide(){
	document.querySelector("#section-0 lottie-player").play();
	document.querySelector("#section-0").classList.add("active");
}

function slide_transition(event){
	let target_index = event.target.dataset.selectorNumber;
	let target_section = document.querySelector("#section-" + target_index);

	// are we already on the current slide?
	if (target_section.classList.contains("active")){
		return;
	}

	// scroll the new section into view
	target_section.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});

	// start the next section's animations
	let target_animation_player = target_section.querySelector("lottie-player");
	if(target_animation_player){
		target_animation_player.play();
	}


	// stop the current section's animations after the scroll has happened
	setTimeout(function(){
		let current_section = document.querySelector("#section-" + window.current_slide);
		let current_animation_player = current_section.querySelector("lottie-player");
		if(current_animation_player){
			current_animation_player.stop();
		}

		// remove "active" from current slide
		current_section.classList.remove("active");

		// add "active to the target slide
		target_section.classList.add("active");

		// update current slide
		window.current_slide = target_index;
	}, 300);
	
}

// not neccessary anymore
function setup_section_colors(){
	let delta_hue = 10;

	let sections = document.querySelectorAll(".section");
	let section_hue = 0;
	sections.forEach(function(current_section, index, all_sections){
		current_section.style.backgroundColor = "hsl(" + section_hue + ", 75%, 75%)";
		section_hue += delta_hue;
	});

	let content_sections = document.querySelectorAll(".section-content");
	let content_section_hue = 120;
	content_sections.forEach(function(current_section, index, all_sections){
		current_section.style.backgroundColor = "hsl(" + content_section_hue + ", 75%, 75%)";
		content_section_hue += delta_hue;
	});
}
