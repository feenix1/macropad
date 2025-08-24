#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "libremidi" for configuration "Release"
set_property(TARGET libremidi APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(libremidi PROPERTIES
  IMPORTED_IMPLIB_RELEASE "${_IMPORT_PREFIX}/lib/libremidi.lib"
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/libremidi.dll"
  )

list(APPEND _cmake_import_check_targets libremidi )
list(APPEND _cmake_import_check_files_for_libremidi "${_IMPORT_PREFIX}/lib/libremidi.lib" "${_IMPORT_PREFIX}/bin/libremidi.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
