###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# activate :livereload

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end


# set :css_dir, 'assets/stylesheets'
# set :js_dir, 'assets/javascripts'
# set :images_dir, 'assets/images'
set :fonts_dir, 'vendor/assets/bower_components/frontend-assets/fonts'

set :white, '#ffffff'
set :off_white, '#f5f7f7'

set :black, '#2e3030'
set :black_two, '#4e4f4f'
set :grey_primary, '#6d6d6d'

set :green_primary, '#428513'
set :green_secondary, '#61a612'
set :green_tertiary, '#115329'
set :green_quaternary, '#337018'
set :green_quinary, '#2d6a1e'

set :green_paler, '#f5f7f8'
set :green_pale, '#f7fbec'
set :green_light, '#b9dd48'
set :green_medium, '#81c724'
set :green_bright, '#adcf3f'
set :green_dark, '#388426'
set :green_one, '#77bf24'
set :green_two, '#20600f'
set :green_three, '#f7fbed'

set :teal_light, '#109e89'
set :teal_dark, '#0e7f6c'

set :blue_pale, '#ebf2f5'
set :blue_light, '#e6f2f7'
set :blue_medium, '#1f6faa'
set :blue_dark, '#18507a'
set :blue_extra_dark, '#0a4358'

set :grey_palest, '#dce3e1'
set :grey_paler, '#f2f4f5'
set :grey_pale, '#edf0f0'
set :grey_paleo, '#ecf0ef'
set :grey_normal, '#d1d5d5'
set :grey_normal_hover, '#eceded'
set :grey_seven, '#929494'
set :grey_eight, '#dce0e0'
set :grey_nine, '#e2e2e2'
set :grey_ten, '#f4f4f4'
set :grey_light, '#a8b2ba'
set :grey_medium_dark, '#6a6d6d'
set :grey_medium, '#526675'
set :grey_dark, '#394752'

set :bluegrey_dark, '#96b4c0'
set :bluegrey_medium, '#cbdae0'
set :bluegrey_light, '#dae1df'

set :pink_light, '#fae8e8'
set :pink_medium, '#e43c8a'
set :pink_dark, '#bf2682'

set :red_light, '#e06e72'
set :red_medium, '#d52b30'
set :red_dark, '#af2745'

set :orange_medium, '#f06431'
set :orange_dark, '#c95d2d'

set :yellow_light, '#ebd520'
set :yellow_light_hover, '#efde4f'
set :yellow_dark, '#ddae1f'

set :colours, [
  [white, '#C1CBD4'], # pdf/doc icon
  [white, grey_primary], #intro text
  [white, black], # default text
  [white, green_secondary],
  [white, '#3E8407'], # green tick
  [white, green_dark],
  [white, bluegrey_dark],
  [white, blue_medium],
  [white, red_medium], # form error message
  [white, '#B13025'], # red cross
  [grey_ten, black], # table row
  [grey_ten, blue_medium], # table row
  [grey_ten, '#6B6B6B'], # table row with info button
  [grey_pale, black],
  [grey_pale, blue_medium],
  [grey_pale, green_quinary],
  [grey_nine, black],
  [grey_normal_hover, black],
  [grey_normal, black],
  [grey_normal, grey_medium], #disabled text input
  [grey_medium, white],
  [green_pale, black],
  [green_pale, blue_medium], # callout with a link
  [green_secondary, white], # menu button hover
  [green_primary, white],
  [green_two, white], # menu button
  [pink_light, red_medium],
  [blue_pale, black],
  [blue_pale, blue_medium],
  [blue_light, blue_medium],
  [yellow_light_hover, black],
  [yellow_light, black]
]

activate :autoprefixer

after_configuration do
  sprockets.append_path File.join root, 'vendor/assets/bower_components'
  sprockets.append_path File.join root, 'vendor/assets/bower_components/requirejs'
  # binding.pry
end

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  activate :asset_hash

  # Use relative URLs
  activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end
