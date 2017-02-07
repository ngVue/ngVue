import angular from 'angular'

export default function ngHtmlCompiler ($rootScope, $compile) {
  return (html, scope) => {
    scope = scope || $rootScope.$new()
    const elem = angular.element(`<div>${html}</div>`)
    $compile(elem)(scope)
    scope.$digest()
    return elem
  }
}
