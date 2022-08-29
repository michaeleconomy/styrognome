require 'json'
require 'haml'


pages = []
begin
  pages = JSON.parse(File.read("pages.json"))
rescue Exception => e
  puts "ERROR reading: pages.json: #{e}"
  exit 1
end
puts "read pages.json"

@games = []
begin
  @games = JSON.parse(File.read("games.json"))
rescue Exception => e
  puts "ERROR reading: games.json: #{e}"
  exit 1
end
puts "read games.json"


def parameterize(s)
  s.downcase.gsub(" ", "_")
end

def do_page(page)
  if !page["template"]
    puts "ERROR: template name not specified for page: #{page}"
    exit 1
  end
  templateFile = page["template"]
  m = /^(.*)\.(\w+)$/.match templateFile
  if !m
    puts "invalid templateFile: #{templateFile}"
    exit 1
  end
  outputFile = page["output"] || m[1]
  outputPath = "public/#{outputFile}"
  extension = m[2]

  templatePath = "templates/#{templateFile}"

  if page["foreach"] == "games"
    for @game in @games
      do_page({
        "output" => parameterize(@game['title']) + ".html",
        "template" => templateFile
      })
    end
    @game = nil
    return
  end

  template = nil
  begin
    template = File.read(templatePath)
  rescue Errno::ENOENT
    puts "ERROR: file not found #{templatePath}"
    exit 1
  end
  output = nil
  case extension
  when "haml"
    begin
      layout = File.read("templates/layouts/application.html.haml")
      pageContents = Haml::Engine.new(template).render(self)
      output = Haml::Engine.new(layout).render(self) do
        pageContents
      end
    rescue Exception => e
      puts "Error rendering haml: #{e}"
      exit 1
    end
  when "scss"
    output = SassC::Engine.new(sass, style: :compressed).render
  else
    puts "unhandled file type: #{extension} for file: #{templateFile}"
    exit 1
  end
  File.write(outputPath, output)
  puts "wrote: #{outputPath}"
end

for page in pages
  do_page(page)
end

puts "Done"