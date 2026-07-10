# Be sure to restart your server when you modify this file.

# Allow the Vite React frontend (localhost:5173) to call this API.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:5173"

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
