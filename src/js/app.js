import ImageLoader from './ImageLoad';

// $('.js-loadme').each((i, el) => {
//     const img = new ImageLoader($(el));
// })

const targets = document.querySelectorAll('.js-loadme');

const options = {
  rootMargin: '0px',
  threshold: [0,0.25,0.5,0.75,1]
};

const observer = new IntersectionObserver(items => {
  // console.log(items);
  items.forEach(el => {
  	// console.log(el.isIntersecting,el.target,el.intersectionRatio);
  	if(el.isIntersecting && el.intersectionRatio>0.25) {
        //   PubSub.publish('SectionInView',el.target);
          if(!$(el.target).hasClass('is-init')) {
              $(el.target).addClass('is-init');
              const img = new ImageLoader($(el.target));
          }
  	}
  });
}, options);

for (let i = 0; i < targets.length; i++) {
  observer.observe(targets[i]);
}