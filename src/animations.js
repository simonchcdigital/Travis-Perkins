window.addEventListener("DOMContentLoaded", function(event){
	number_sections();
	setup_section_selectors();
	setup_colors();
	start_first_slide();
	setup_wheel_transitions();
});

window.current_slide = 0;
window.transitioning = false;

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
	document.querySelector("#selector-0").classList.add("selected");
}

function slide_transition(event){

	window.transitioning = true;

	let target_selector = event.target;
	let target_index = parseInt(target_selector.dataset.selectorNumber);

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

	let current_selector = document.querySelector("#selector-" + window.current_slide);

	// remove "selected" from the current selector
	current_selector.classList.remove("selected");

	// add "selected" to the target selector
	target_selector.classList.add("selected");


	// stop the current section's animations after the scroll has happened
	setTimeout(function(){
		let current_section = document.querySelector("#section-" + window.current_slide);
		let current_animation_player = current_section.querySelector("lottie-player");

		if(current_animation_player){
			current_animation_player.stop();
		}

		// remove "active" from current slide
		current_section.classList.remove("active");

		// add "active" to the target slide
		target_section.classList.add("active");


		// update current slide
		window.current_slide = parseInt(target_index);
		window.transitioning = false;
	}, 300);
	
}

function setup_wheel_transitions(){
	window.addEventListener("swiped-up", function(){
		if(transitioning){ return; }
		next_slide();
	});

	window.addEventListener("swiped-down", function(){
		if(transitioning){ return; }
		prev_slide();
	});

	window.addEventListener("wheel", function(){
		if(transitioning){ return; }
		if(event.deltaY > 50){
			console.log("wheel next");
			next_slide();
		}
		if(event.deltaY < 50){
			console.log("wheel prev");
			prev_slide();
		}
	});
}

function next_slide(){
	// check bounds
	let num_sections = document.querySelectorAll(".section-selector").length;
	let next_section_num = window.current_slide + 1;
	console.log("next slide");
	console.log(next_section_num);
	if(next_section_num < num_sections){
		// simulate a click on the next section
		document.querySelector("#selector-" + next_section_num).click();
	}
}

function prev_slide(){
	// check bounds
	let next_section_num = window.current_slide - 1;
	if(next_section_num >= 0){
		console.log(next_section_num);
		// simulate a click on the next section
		document.querySelector("#selector-" + next_section_num).click();
	}
}

function setup_colors(){
	let delta_hue = 10;

	let sections = document.querySelectorAll(".spacer, .section");
	let hue = 20;
	sections.forEach(function(current_section, index){
		current_section.style.background = "linear-gradient(0deg, " +
			"hsl(" + hue + ((index+1)*delta_hue) + ", 40%, 20%) 0%," +
			"hsl(" + hue + (index*delta_hue) + ", 40%, 20%) 100%) ";
	});
}
