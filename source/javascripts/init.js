var anchoredSection = $('.js-anchor');
var contactForm = $('.js-contact-form');
var contactButton = $('.js-contact-button');
var contactSection = $('.js-contact-section');
var firstInputOfContactForm = contactForm.children('input').first();
var fadeIn = $('.js-fade-in');
var flashSuccess = $('.flash-success');
var flashError = $('.flash-error');
var navLink = $('.js-nav-link');
var navItem = navLink.parent();
var onMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var requiredFormFields = $('.js-required-field');


//


$(window).bind("scroll.scrollNav", function() { 
  if (!onMobileDevice) {
    checkCurrentSectionOnScroll()
  };
});

$(window).load(function() {
  fadeInPage();
  showFlashes();

  if (!onMobileDevice) {
    activateNav();
    setHeaderSectionHeight();
  };
});

$(window).resize(function() {
  if (!onMobileDevice) {
    setHeaderSectionHeight();
  };
});

contactButton.click(scrollToContactSection);
contactForm.submit(validateForm);
navLink.click(function(){ activateLinkAndScrollToAnchor($(this)) });


//


function activateNav() {
  $(window).scrollTop($(window).scrollTop() + 1);
  $(window).scrollTop($(window).scrollTop() - 1);
}

function activateLinkAndScrollToAnchor(clickedNavLink) {
  var activeNavLink = clickedNavLink;
  var activeNavItem = activeNavLink.parent();
  var targetAnchorName = clickedNavLink.data('anchor');
  var targetAnchorId = '#' + targetAnchorName;

  updateNav(activeNavLink, activeNavItem);
  
  $(window).unbind('.scrollNav');
  $('body').animate({ scrollTop: Math.ceil($(targetAnchorId).offset().top) }, 500,
    function() { 
      if (targetAnchorName == 'contact') { focusOnForm(); }
      $(window).bind("scroll.scrollNav", function() { checkCurrentSectionOnScroll() });
  });
}

function fadeInPage() {
  fadeIn.addClass('fade-in');
}

function focusOnForm() {
  if (!onMobileDevice) {
    firstInputOfContactForm.focus();
  };
}

function scrollToContactSection() {
  $('body').animate({ scrollTop: Math.ceil(contactSection.offset().top) }, 500, function() { focusOnForm() });
}

function setHeaderSectionHeight() {
  var contentMaxWidth = parseInt($('.js-wrap').css('max-width'))
  var header = $('.js-header');
  var headerInner= $('.js-header-inner');
  var headerInnerHeight = headerInner.height();
  var logoHeight = $('.js-logo').outerHeight();
  var windowHeight = $(window).height();
  var windowHeightMinusLogo = windowHeight - logoHeight;
  var windowWidth = $(window).width();
  var windowTall = windowHeightMinusLogo > headerInnerHeight;
  var windowWide = windowWidth > contentMaxWidth;
  var headerAdjustable = windowWide && windowTall;

  if (headerAdjustable) {
    header.height(windowHeightMinusLogo);
    header.removeClass('header-padding');
    header.addClass('header-unpadded');
    headerInner.css('padding-top', (windowHeightMinusLogo - headerInnerHeight)/2);
  } else {
    header.css('height', 'auto')
    header.removeClass('header-unpadded');
    header.addClass('header-padding');
    headerInner.css('padding-top', 0);
  }
}

function showFlashes() {
  if ($.url().param('success') == 'true') {
    flashSuccess.slideDown('slow');
  
  } else if ($.url().param('success') == 'false') {
    flashError.slideDown('slow');
  };
}

function checkCurrentSectionOnScroll() {
  anchoredSection.each(function() {
    var section = $(this);
    var sectionId = section.attr('id');
    var sectionNavLink = $('[data-anchor="' + sectionId + '"]');
    var sectionNavItem = sectionNavLink.parent();
    var sectionTop = section.offset().top;
    var sectionBottom = sectionTop + section.outerHeight();
    var windowScrollHeight = $(window).scrollTop();
    var windowBelowSectionTop = windowScrollHeight >= sectionTop;
    var windowAboveSectionBottom = windowScrollHeight < sectionBottom;
    var windowInsideSection = windowAboveSectionBottom && windowBelowSectionTop;
    var sectionNavNotActive = !sectionNavLink.hasClass('active');

    if (windowInsideSection) {
      updateNav(sectionNavLink, sectionNavItem);
    };
  });
}

function updateNav(currentNavLink, currentNavItem) {
  navLink.add(navItem).removeClass('active');
  currentNavLink.add(currentNavItem).addClass('active');
}

function validateForm() {
  var invalidFieldsDetected = !validateRequiredFields();

  if (invalidFieldsDetected) {
    return false;
  };
}

function validateRequiredFields() {
  var valid = true;

  requiredFormFields.each(function() {
    if ($(this).val().length == 0) {
      $(this).addClass('form-error');
      valid = false;
    } else {
      $(this).removeClass('form-error');
    };
  });

  return valid;
}
