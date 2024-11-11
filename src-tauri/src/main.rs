// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      // Get the main window
      let window = app.get_window("main").unwrap();

      // Get the monitor size
      if let Some(monitor) = window.current_monitor().unwrap() {
        let screen_size = monitor.size();
        let width = (screen_size.width as f32 * 0.9) as u32;
        let height = (screen_size.height as f32 * 0.9) as u32;

        // Set the window size to 90% of screen dimensions
        window.set_size(tauri::Size::Physical(tauri::PhysicalSize { width, height })).unwrap();
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
