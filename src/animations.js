window.addEventListener("DOMContentLoaded", function(event){

	/*
	anime({
	  targets: "h1",
	  translateX: 250
	});
	*/

	number_sections();
	setup_section_selectors();
	setup_section_colors();
	setup_animations();
});

window.crawling_sprites = [];

function setup_animations(){
	let sprites = document.querySelectorAll(".animated-sprite");
	sprites.forEach(function(sprite, index, all_sprites){
		if(sprite.classList.contains("random-crawl")){
			window.crawling_sprites.push(sprite);
		}
	});
	run_animations();
}

function run_animations(timestamp){
	if(window.crawling_sprites.length > 0){
		window.crawling_sprites.forEach(function(sprite, index){
			random_crawl_step(sprite)
		});
	}

	window.requestAnimationFrame(run_animations);
}

function move_elem_polar(elem, angle, distance){
}

function random_crawl_step(elem){
	let pos = {
		x: parseFloat(elem.style.left),
		y: parseFloat(elem.style.top)
	};
	let variation = 10;

	pos.x += (Math.random() - 0.5) * variation;
	pos.y += (Math.random() - 0.5) * variation;

	elem.style.left = pos.x + "px";
	elem.style.top = pos.y + "px";
}

function number_sections(){
	let sections = document.querySelectorAll(".section");
	sections.forEach(function(sec, i){
		sec.id = "section-" + i;
	});
}

function setup_section_selectors(){
	let sections = document.querySelectorAll(".section");
	let section_selector_container = document.querySelector("#section-selector-container");

	sections.forEach(function(current_section, index, all_sections){
		let section_selector = document.createElement("div");
		section_selector.classList.add("section-selector")
		section_selector.id = "selector-" + index;
		
		section_selector.addEventListener("click", function(event){
			let target_section = document.querySelector("#section-" + index);
			target_section.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});
		});

		section_selector_container.appendChild(section_selector);

	});
}

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
