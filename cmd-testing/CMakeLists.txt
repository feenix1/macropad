# CMakeList.txt : CMake project for cmd-testing, include source and define
# project specific logic here.
#

# Add source to this project's executable.
add_executable (cmd-testing "cmd-testing.cpp" "cmd-testing.h")

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET cmd-testing PROPERTY CXX_STANDARD 20)
endif()

# TODO: Add tests and install targets if needed.
